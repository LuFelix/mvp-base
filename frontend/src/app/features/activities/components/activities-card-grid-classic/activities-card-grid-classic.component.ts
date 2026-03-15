// Caminho: src/app/features/activities/components/activities-card-grid-classic/activities-card-grid-classic.component.ts
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider'; // Útil para listas clássicas

import { CompleteActivity } from '../../../shared/models/activity.model';

@Component({
  selector: 'app-activities-card-grid-classic', 
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './activities-card-grid-classic.component.html',
  styleUrls: ['./activities-card-grid-classic.component.scss'],
})
export class ActivitiesGridClassicComponent {
  private router = inject(Router);

  @Input() activities: CompleteActivity[] = [];
  @Input() isLoading = true;
  @Input() errorLoading = false;
  @Output() retryLoad = new EventEmitter<void>();

  viewActivity(activityId: string): void {
     this.router.navigate(['/app/activities', activityId]);
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'simulador': return 'show_chart';
      case 'conversor': return 'sync_alt';
      case 'comparador': return 'compare_arrows';
      default: return 'calculate';
    }
  }
}