// Caminho: src/app/features/activities/pages/available-activities-page/available-activities-page.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMPTY, catchError, finalize } from 'rxjs'; 

import { LayoutService } from '../../../../core/services/layout.service';
import { ActivitiesService } from '../../services/activities.service';
// Modelos (Você precisará criar esse arquivo em features/shared/models/activity.model.ts)
import { CompleteActivity } from '../../../shared/models/activity.model';

// Importa os dois "Garçons" (layouts) que criaremos a seguir
import { ActivitiesGridModernComponent } from '../../components/activities-card-grid-modern/activities-card-grid-modern.component';
import { ActivitiesGridClassicComponent } from '../../components/activities-card-grid-classic/activities-card-grid-classic.component'; 

@Component({
  selector: 'app-available-activities-page',
  standalone: true,
  imports: [
    CommonModule, 
    ActivitiesGridModernComponent, 
    ActivitiesGridClassicComponent  
  ],
  templateUrl: './available-activities-page.component.html',
  styleUrls: ['./available-activities-page.component.scss']
})
export class AvailableActivitiesPageComponent implements OnInit { 
  
  public layoutService = inject(LayoutService);
  private activitiesService = inject(ActivitiesService);

  public activities: CompleteActivity[] = [];
  public isLoading = true;
  public errorLoading = false;

  ngOnInit(): void {
    console.log('[Chef Atividades] ngOnInit: Começando a carregar...');
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading = true;
    this.errorLoading = false;
    console.log('[Chef Atividades] loadActivities: Chamando a API/Service...');
    
    this.activitiesService
      .findAllActivities({ 
          page: 1, 
          limit: 100, 
          isActive: true 
      }) 
      .pipe(
        catchError((err) => {
          console.error('[Chef Atividades] ERRO no Service:', err);
          this.errorLoading = true;
          return EMPTY;
        }),
        finalize(() => {
          console.log('[Chef Atividades] FINALIZE: A chamada terminou. isLoading = false');
          this.isLoading = false; 
        })
      )
      .subscribe((response) => {
        console.log('[Chef Atividades] SUCESSO: Dados recebidos.');
        this.activities = response.data; // Supondo que a resposta venha no padrão { data: [...] }
      });
  }
}