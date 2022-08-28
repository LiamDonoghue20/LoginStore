import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];
let basketItems = JSON.parse(localStorage.getItem('basketItems')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // extending the HttpInterceptor class you can create a custom interceptor 
        //to modify http requests before they get sent to the server.
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

            // FakeBackendInterceptor intercepts certain requests based on their URL and provides
            // a fake response instead of going to the server.
        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            //in the users array, find the username and password passed to the authenticate method
            const user = users.find((x: { username: any; password: any; }) => x.username === username && x.password === password);
            //if there is no user that is matched return error that the info is incorrect
            if (!user) return error('Username or password is incorrect');
            //if there is a user returned, assign the local variable to the user data matched, as well as a JWT token
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            //if the username matches one that has already been added to the users array
            //then return an error that the username is already taken
            if (users.find((x: { username: any; }) => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            //add an id to the user
            //Increment the length of the users array by 1 
            user.id = users.length ? Math.max(...users.map((x: { id: any; }) => x.id)) + 1 : 1;
            //pushes the new user to the users array
            users.push(user);
            //set the local storage with the new users array using JSON
            localStorage.setItem('users', JSON.stringify(users));
            //return a 200 response once the user has been added to the array
            return ok();
        }

        //dont return user if the user isn't logged in
        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function getBasketItems(){
            if (!isLoggedIn()) return unauthorized;
            return ok(basketItems)
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            //filter out the user from the users array with their id
            //idFromUrl so the user currently logged in cant delete themself
            users = users.filter((x: { id: number; }) => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        // helper functions
        //returns 200
        function ok(body?: { id: any; username: any; firstName: any; lastName: any; token: string; } | undefined) {
            return of(new HttpResponse({ status: 200, body }))
        }
        //returns error messages
        function error(message: string) {
            return throwError({ error: { message } });
        }
        //return unauth user
        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }
        //checks that the user has the correct JWT, return true if so
        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
        //adds the ID to the URL
        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};