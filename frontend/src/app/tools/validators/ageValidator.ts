import * as moment from 'moment';
import { AbstractControl } from '@angular/forms';

export function AgeValidator(control: AbstractControl): { [key: string]: boolean } | null {

    if (control.value !== undefined && (isNaN(control.value) || moment().diff(control.value, 'years') < 18)) {
        return { 'AgeValidator': true };
    }

    return null;
}
