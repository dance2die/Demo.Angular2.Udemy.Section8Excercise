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
    }
}