import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { SummaryComponent } from './main-content/summary/summary.component';
import { BoardComponent } from './main-content/board/board.component';
import { AddTaskComponent } from './main-content/add-task/add-task.component';
import { ContactsComponent } from './main-content/contacts/contacts.component';
import { HelpUserComponent } from './help-user/help-user.component';
import { MainContentComponent } from './main-content/main-content.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'main-content',
    component: MainContentComponent,
    children: [
      { path: '', redirectTo: 'summary', pathMatch: 'full' },
      { path: 'summary', component: SummaryComponent },
      { path: 'board', component: BoardComponent },
      { path: 'add-task', component: AddTaskComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'help-user', component: HelpUserComponent },
      { path: 'privacy-policy', component: PrivacyComponent },
      { path: 'legal-notice', component: LegalNoticeComponent },
    ],
  },
];
