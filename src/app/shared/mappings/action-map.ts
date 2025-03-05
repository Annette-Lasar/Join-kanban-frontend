import { ActionService } from '../services/action.service';
import { ContactStatusService } from '../services/contact-status.service';
import { ButtonPropertyService } from '../services/button-propertys.service';
import { BoardStatusService } from '../services/board-status.service';
import { InfoBoxService } from '../services/info-box.service';

export function createActionMap(
  actionService: ActionService,
  contactStatusService: ContactStatusService,
  buttonPropertyService: ButtonPropertyService,
  boardStatusService: BoardStatusService,
  infoBoxService: InfoBoxService
) {
  return new Map<
    string,
    (message?: string, id?: number, event?: Event) => void
  >([
    ['toggle', (message) => actionService.toggleInfoContainer(message)],
    [
      'showAddContactForm',
      () => buttonPropertyService.setIsAddContactButtonStatus(true),
    ],
    [
      'showContactDetailOptions',
      () => contactStatusService.setContactDetailFormStatus(true),
    ],
    [
      'showEditContactForm',
      () => contactStatusService.setContactFormStatus(true),
    ],
    ['createNewContact', () => actionService.onCreateContactClick()],
    ['clearInputFields', () => buttonPropertyService.setClearInputStatus(true)],
    [
      'openSecurityInfo',
      (message, id) =>
        actionService.organizeSecurityQuestion(id!, 'setItemToDelete'),
    ],
    ['openDeleteTaskSecurityInfo', (message, id) => actionService.organizeSecurityQuestion(id!, 'deleteTask')],
    ['closeSecurityInfo', () => actionService.showOrHideInfoBox(false)],
    ['onToggleShowLogin', () => actionService.showSignUp()],
    ['guestLogin', () => actionService.triggerGuestLogin()],
    [
      'setTaskToDelete',
      (message, id) =>
        actionService.prepareDeleteAction(id!, 'setTaskToDelete'),
    ],
    [
      'deleteTask',
      (message, id) => actionService.prepareDeleteAction(id!, 'deleteTask'),
    ],
    [
      'deleteCategory',
      (message, id) => actionService.prepareDeleteAction(id!, 'deleteCategory'),
    ],
    [
      'setContactToDelete',
      (message, id) =>
        actionService.prepareDeleteAction(id!, 'setContactToDelete'),
    ],
    [
      'deleteContact',
      (message, id) => actionService.prepareDeleteAction(id!, 'deleteContact'),
    ],
    ['showEditTaskMode', () => actionService.toggleEditTaskMode('show')],
    ['closeTaskEditMode', () => actionService.toggleEditTaskMode('hide')],
    ['closeTaskDetail', (message, id) => actionService.closeTaskDetail(id!)],
    ['saveEditedTask', (message, id) => actionService.saveEditedTask(id!)],
    [
      'openAddSubtaskBox',
      (message, id, event) =>
        actionService.toggleAddSubtaskBox(message, id, event),
    ],
    [
      'cancelAddSubtask',
      (message, id, event) =>
        actionService.toggleAddSubtaskBox(message, id, event),
    ],
    [
      'saveAddedSubtask',
      (message, id, event) =>
        actionService.toggleAddSubtaskBox(message, id, event),
    ],
    ['deleteSubtask', (message, id) => actionService.deleteSubtask(id!)],
    [
      'saveEditedSubtask',
      (message, id) => actionService.saveEditedSubtask(id!),
    ],
    [
      'openEditSubtaskBox',
      (message, id) => actionService.openEditSubtaskBox(id!),
    ],

    // add further actions here if necessary.
  ]);
}
