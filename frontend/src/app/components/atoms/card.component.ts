import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="rounded-xl border bg-white shadow border-gray-200 {{ className }}">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-header',
  template: `
    <div class="flex flex-col space-y-1.5 p-6 {{ className }}">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardHeaderComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-title',
  template: `
    <h3 class="font-semibold leading-none tracking-tight {{ className }}">
      <ng-content></ng-content>
    </h3>
  `,
  styles: []
})
export class CardTitleComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-description',
  template: `
    <p class="text-sm text-gray-500 {{ className }}">
      <ng-content></ng-content>
    </p>
  `,
  styles: []
})
export class CardDescriptionComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-content',
  template: `
    <div class="p-6 pt-0 {{ className }}">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardContentComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-footer',
  template: `
    <div class="flex items-center p-6 pt-0 {{ className }}">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardFooterComponent {
  @Input() className = '';
}
