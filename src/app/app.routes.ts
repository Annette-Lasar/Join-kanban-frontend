import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { SummaryComponent } from './summary/summary.component';
import { BoardComponent } from './board/board.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { ContactsComponent } from './contacts/contacts.component';
import { HelpUserComponent } from './help-user/help-user.component';

export const routes: Routes = [
  { path: '', component: MainContentComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'board', component: BoardComponent },
  { path: 'add_task', component: AddTaskComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'help-user', component: HelpUserComponent },
];
