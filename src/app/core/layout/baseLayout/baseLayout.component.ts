import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [PanelModule, ToggleSwitchModule, RouterModule],
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
