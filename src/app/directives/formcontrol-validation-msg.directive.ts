import { Directive, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { NgControl } from "@angular/forms";
import { ValidationMsgService } from "../services/validation-msg.service";

@Directive({
    selector:'[appFormControlValidationMsg]'
})
export class FormControlValidationMsgDirective implements OnInit, OnDestroy{
    constructor(private elRef: ElementRef,
        private control: NgControl,
        private validationMsgService: ValidationMsgService
        ){}
        
}