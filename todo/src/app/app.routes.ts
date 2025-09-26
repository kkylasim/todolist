import { Routes } from '@angular/router';
import { AppLayout } from './layout/app-layout';

//pages
import { Dashboard } from './pages/dashboard/dashboard';
import { ListView } from './pages/list-view/list-view';
import { CalendarView } from './pages/calendar-view/calendar-view';
import { TaskView } from './pages/task-view/task-view';

export const routes: Routes = [
    { path: 'dashboard', component: Dashboard },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard' }
  ];
// export const routes: Routes = [
//     {
//         path: '',
//         component: AppLayout,
//         children: [
//           { path: '', component: Dashboard }, 
//           { path: 'listView', component: ListView },
//           { path: 'calendarView', component: CalendarView },
//           { path: 'taskView', component: TaskView },
//         //   { path: "list", component: ListView }
//         ]
//       },

//   { path: "**", redirectTo: "dashboard" }
// ];
