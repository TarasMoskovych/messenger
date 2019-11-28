import { trigger, transition, style, animate } from '@angular/animations';

export const fadeOut = trigger('fadeOut', [
  transition(':leave', [
    style({
        opacity: 1,
        transform: 'scale(1)'
    }),
    animate(250, style({
        opacity: 0,
        transform: 'scale(0.5)'
    }))
  ])
]);
