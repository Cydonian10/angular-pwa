import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Params, Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  installlEvent: any = null;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.installlEvent = event;
  }

  private router = inject(Router);
  private swUpdate = inject(SwUpdate);
  private alert = inject(MatSnackBar);

  public searchInput = new FormControl('');

  ngOnInit() {
    this.searchInput.valueChanges.subscribe((resp) => {
      const queryParams: Params = {};
      if (resp === undefined) {
        queryParams['name'] = 'All';
      }
      queryParams['name'] = resp;

      this.router.navigate([''], { queryParams });
    });

    this.updatePWA();
  }

  installByUser() {
    if (this.installlEvent) {
      this.installlEvent.prompt();
      this.installlEvent.userChoice.then((rta: any) => {
        if (rta.outcome === 'accepted') {
          console.log('La aplicación fue instalada');
        } else {
          console.log('El usuario rechazó la instalación');
        }
      });
    }
  }

  updatePWA() {
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe((evt) => {
        //  if (promptUser(evt)) {
        // Reload the page to update to the latest version.
        const result = this.alert.open('Reload Page', 'x', {
          duration: 1000 * 10,
        });
        result.onAction().subscribe(() => {
          console.log('Cerror');
          document.location.reload();
        });
        //}
      });
  }

  openAlert() {}
}

// this.swUpdate.versionUpdates
//       .pipe(
//         filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
//         tap((evt: VersionReadyEvent) => {
//           console.info(`currentVersion=[${evt.currentVersion?.hash} | latestVersion=[${evt.latestVersion?.hash}]`)
//         })
//       )
//       .subscribe(evt => {
//         const snack = this.snackBar.open('Update Available', 'Reload.', { duration: 0 })
//         snack.onAction()
//           .subscribe(() => {
//             window.location.reload()
//           })
//       })
