import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
@Component({
  selector: 'app-base-layout',
  imports: [PanelModule, ToggleSwitchModule, RouterModule, CommonModule],
  templateUrl: './baseLayout.component.html',
  styleUrl: './baseLayout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseLayoutComponent {
  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('dark-mode');
  }
}
