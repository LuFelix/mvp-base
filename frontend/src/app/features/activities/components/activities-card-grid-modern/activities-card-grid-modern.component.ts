// Caminho: src/app/features/activities/components/activities-card-grid-modern/activities-card-grid-modern.component.ts
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 

// Imports do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Modelos
import { CompleteActivity } from '../../../shared/models/activity.model';

@Component({
  selector: 'app-activities-card-grid-modern', 
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './activities-card-grid-modern.component.html',
  styleUrls: ['./activities-card-grid-modern.component.scss'],
})
export class ActivitiesGridModernComponent {
  private router = inject(Router);

  @Input() activities: CompleteActivity[] = [];
  @Input() isLoading = true;
  @Input() errorLoading = false;
  @Output() retryLoad = new EventEmitter<void>();

  // Navega para a rota de uso da atividade (Ex: /app/activities/simulador-juros)
  viewActivity(activityId: string): void {
     this.router.navigate(['/app/activities', activityId]);
  }

  // Ícones baseados no tipo de atividade
  getActivityIcon(type: string): string {
    switch (type) {
      case 'simulador': return 'show_chart';
      case 'conversor': return 'sync_alt';
      case 'comparador': return 'compare_arrows';
      default: return 'calculate';
    }
  }
}