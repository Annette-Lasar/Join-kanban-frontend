import { ActionService } from '../services/action.service';
import { ContactStatusService } from '../services/contact-status.service';
import { ButtonPropertyService } from '../services/button-propertys.service';
import { BoardStatusService } from '../services/board-status.service';
import { InfoBoxService } from '../services/info-box.service';
import { InfoMessage } from '../interfaces/info-message.interface';

export function createActionMap(
  actionService: ActionService,
  contactStatusService: ContactStatusService,
  buttonPropertyService: ButtonPropertyService,
  boardStatusService: BoardStatusService,
  infoBoxService: InfoBoxService
): Map<string, (infoMessage: InfoMessage, event?: Event) => void> {
  return new Map([
    [
      'handleInfoAndSuccessMessages',
      (infoMessage) => actionService.handleInfoContainers(infoMessage),
    ],
    [
      'showAddOrEditContactForm',
      (infoMessage) => actionService.showAddOrEditContactForm(infoMessage),
    ],
    [
      'showContactDetailOptions',
      () => contactStatusService.setContactDetailFormStatus(true),
    ],
    ['closeContactForm', () => actionService.closeContactForm()],
    ['createNewContact', () => actionService.onCreateContactClick()],
    ['clearInputFields', () => buttonPropertyService.setClearInputStatus(true)],
/*     [
      'openSecurityInfo',
      (infoMessage?) =>
        actionService.organizeSecurityQuestion(
          infoMessage!.id!,
          'setItemToDelete'
        ),
    ], */
    [
      'openDeleteTaskSecurityInfo',
      (infoMessage) =>
        actionService.organizeSecurityQuestion(infoMessage!.id!, 'deleteTask'),
    ],
    ['closeSecurityInfo', () => actionService.showOrHideInfoBox(false)],
    ['onToggleShowLogin', () => actionService.showSignUp()],
    ['guestLogin', () => actionService.triggerGuestLogin()],
    [
      'setTaskToDelete',
      (infoMessage) =>
        actionService.prepareDeleteAction(infoMessage.id!, 'setTaskToDelete'),
    ],
    [
      'deleteTask',
      (infoMessage) =>
        actionService.prepareDeleteAction(infoMessage.id!, 'deleteTask'),
    ],
    [
      'deleteCategory',
      (infoMessage) =>
        actionService.prepareDeleteAction(infoMessage.id!, 'deleteCategory'),
    ],
    [
      'setContactToDelete',
      (infoMessage) =>
        actionService.prepareDeleteAction(
          infoMessage.id!,
          'setContactToDelete'
        ),
    ],
    [
      'deleteContact',
      (infoMessage) =>
        actionService.prepareDeleteAction(infoMessage.id!, 'deleteContact'),
    ],
    [
      'showEditTaskMode',
      (infoMessage) =>
        actionService.toggleEditTaskMode('show', infoMessage.id!),
    ],
    [
      'closeTaskEditMode',
      (infoMessage) =>
        actionService.toggleEditTaskMode('hide', infoMessage.id!),
    ],
    ['closeTaskDetail', () => actionService.closeTaskDetail()],
    [
      'saveEditedTask',
      (infoMessage) => actionService.saveEditedTask(infoMessage.id!),
    ],
    [
      'openAddSubtaskBox',
      (infoMessage, event) =>
        actionService.toggleAddSubtaskBox(
          infoMessage.infoText,
          infoMessage.id,
          event
        ),
    ],
    [
      'cancelAddSubtask',
      (infoMessage, event) =>
        actionService.toggleAddSubtaskBox(
          infoMessage.infoText,
          infoMessage.id,
          event
        ),
    ],
    [
      'saveAddedSubtask',
      (infoMessage, event) =>
        actionService.toggleAddSubtaskBox(
          infoMessage.infoText,
          infoMessage.id,
          event
        ),
    ],
    [
      'deleteSubtask',
      (infoMessage) => actionService.deleteSubtask(infoMessage.id!),
    ],
    [
      'saveEditedSubtask',
      (infoMessage) => actionService.saveEditedSubtask(infoMessage.id!),
    ],
    [
      'openEditSubtaskBox',
      (infoMessage) => actionService.openEditSubtaskBox(infoMessage.id!),
    ],
    ['resetNewTask', () => actionService.resetNewTask()],
    [
      'openAddTaskOverlay',
      (infoMessage) => actionService.openAddTaskOverlay(infoMessage.infoText!),
    ],
    ['closeAddTaskOverlay', () => actionService.closeAddTaskOverlay()],

    // add further actions here if necessary.
  ]);
}
