import {
    trigger,
    animate,
    transition,
    style,
    state
  } from '@angular/animations';
  
  export const moveAnimation = trigger('moveAnimation', 
    [
      /* state('in', 
        style({ width: '{{ inWidth }}', overflow:'hidden'}),
        { params: { inWidth: '250px'}}
      ),
      state('out', 
        style({ width: '{{ outWidth }}'}),
        { params: { outWidth: '*'}}
      ),
      transition('* <=> *',animate('{{ time }}')) */



      

      /* transition(':enter', [
        style({ transform: '{{ translateBefore }}' }),
        animate(200, style({ transform: '{{ translateAfter }}' })),
      ]),
    ] */

    transition(':enter', [
      style({ width: '{{ width }}' }),
      animate(200),
    ]),
  ]
  );
  