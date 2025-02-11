import { CanDeactivateFn } from '@angular/router';

export const editExitGuard: CanDeactivateFn<unknown> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  console.log(component, currentRoute, currentState, nextState);
  // TODO: check if there are unsaved changes
  // @ts-ignore
  if (component.canDeactivate) {
    // @ts-ignore
    return component.canDeactivate();
  }

  return true;
};
