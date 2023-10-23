import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { delay, map } from 'rxjs';

interface Character {
  image: string;
  name: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div *ngIf="loading(); else view">loading..</div>

    <ng-template #view>
      <mat-card *ngFor="let character of characters()" class="example-card">
        <img
          mat-card-image
          [src]="character.image"
          alt="Photo of a Shiba Inu"
        />
        <mat-card-content>
          <p>
            {{ character.name }}
          </p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button>LIKE</button>
          <button mat-button>SHARE</button>
        </mat-card-actions>
      </mat-card>
    </ng-template>
  `,
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchComponent {
  private http = inject(HttpClient);
  public characters = signal<Character[]>([]);
  public loading = signal(false);

  @Input() set name(value: string) {
    this.loading.update((resp) => !resp);
    let params = new HttpParams();
    if (value !== 'All') {
      if (value) params = params.set('name', value);
    }
    this.http
      .get<{ results: Character[] }>(
        'https://rickandmortyapi.com/api/character/',
        {
          params,
        }
      )
      .pipe(
        map((resp) => resp.results),
        delay(2000)
      )
      .subscribe((resp) => {
        this.loading.update((resp) => !resp);
        this.characters.set(resp);
      });
  }
}
