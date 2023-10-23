import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Params, Router, RouterOutlet } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface QueryParams {
  name?: string;
  status?: string;
}

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
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private router = inject(Router);

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
  }
}
