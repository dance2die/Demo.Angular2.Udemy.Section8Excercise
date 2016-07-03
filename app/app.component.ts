import {Component} from 'angular2/core';
import {Observable} from "rxjs/Rx";
import {ControlGroup, FormBuilder} from 'angular2/common';
import 'rxjs/add/observable/fromArray'; // This one was missing from the Importing Operators video and is causing the error.
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
    selector: 'my-app',
    template: `
        <form [ngFormModel]="form">
            <input type="text" ngControl="search">
        </form>
    `
})
export class AppComponent {
    form: ControlGroup;

    constructor(fb: FormBuilder) {
        this.form = fb.group({
            search: []
        });

        var search = this.form.find('search');
        search.valueChanges
            .debounceTime(400)
            .map(str => (<string>str).replace(' ', '-'))
            .subscribe(x => console.log(x));

        // this.testObservables();
        // this.testInterval();
        // this.testForkJoin();
        // this.testHandlingErrors();
        // this.testMultipleTries();
        // this.testCatching();
        // this.testTimeout();
        this.testObservableNotification();


    }

    private testObservableNotification() {
        var observable = Observable.fromArray([1,2,3]);
        observable.subscribe(
            x => console.log(x),
            error => console.error(error),
            () => console.log("Completed")
        );

        var observable2 = Observable.throw(new Error("error"));
        observable2.subscribe(
            x => console.log(x),
            error => console.error(error),
            () => console.log("Completed")
        );
    }

    private testTimeout() {
        var remoteDataStream = Observable.of([1,2,3]).delay(5000);
        remoteDataStream
            .timeout(1000)
            .subscribe(
                x => console.log(x),
                error => console.error(error)
            );
    }

    private testCatching() {
        // var remoteDataStream = Observable.throw(new Error("Something failed."));
        var remoteDataStream = Observable.of([4,5,6]);

        remoteDataStream
            .catch(err => {
                var localDataStream = Observable.of([1,2,3]);
                return localDataStream;
            })
            .subscribe(x => console.log(x));
    }

    private testMultipleTries() {
        var counter = 0;

        var ajaxCall = Observable.of('url')
            .flatMap(() => {
                if (++counter < 2) {
                    return Observable.throw(new Error("Request failed"));
                }
                return Observable.of([1,2,3]);
            });

        ajaxCall
            .retry(3)
            .subscribe(
                x => console.log(x),
                error => console.error(error)
            );
    }

    private testHandlingErrors() {
        var observable = Observable.throw(new Error("Something failed."));
        observable.subscribe(
            x => console.log(x),
            error => console.log(error)
        );
    }

    private testForkJoin() {
        var userStream = Observable.of({
            userId: 1, username: 'mosh'
        }).delay(2000);

        var tweetsStream = Observable.of([1,2,3]).delay(1500);

        Observable
            .forkJoin(userStream, tweetsStream)
            .map(joined => new Object({user: joined[0], tweets: joined[1]}))
            .subscribe(result => console.log(result));
    }

    private testInterval() {
        var observable = Observable.interval(1000);
        observable
            .flatMap(x => {
                console.log("calling the server to get the latest news");
                return Observable.of([1, 2, 3]);
            })
            .subscribe(news => console.log(news));
    }

    testObservables() : any {
        // var observable = Observable.fromArray([1, 2, 3]);
        var startDates = [];
        var startDate = new Date(); // Assuming today for simplicity

        for (var day = -2; day <= 2; day++) {
            var date = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate() + day
            );

            startDates.push(date);
        }

        Observable
        // .of(startDates)
            .fromArray(startDates)
            .map(date => {
                console.log("Getting deals for date " + date);
                return [1, 2, 3];
            })
            .subscribe(x => console.log(x));
    }
}