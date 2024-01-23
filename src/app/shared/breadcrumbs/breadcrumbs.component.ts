import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: ``
})
export class BreadcrumbsComponent implements OnDestroy {
  
  public titulo: string | undefined;
  public tituloSubs$: Subscription

  constructor(private router: Router) {
    this.tituloSubs$ = this.getArgumentosRuta()
                        .subscribe(({titulo}) => {
                          this.titulo = titulo;
                          document.title = `AdminPro - ${titulo}`;
                        });
  }

  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getArgumentosRuta() {
    return this.router.events
      .pipe(
        filter((event: any) => event instanceof ActivationEnd), // Filtramos sólo los de tipo ActivationEnd
        filter((event: ActivationEnd) => event.snapshot.firstChild === null), // Filtramos sólo el ActivationEnd donde en la pripiedad .snapshot.firstChild es null
        map((event: ActivationEnd) => event.snapshot.data),
      );
    //   .subscribe(data => {
    //     this.titulo = data['titulo'];
    // });
    
  }

}
