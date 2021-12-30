import { Scaleform } from './Scaleform';
import { IButton } from './interfaces/IButton';

/**
 * Draw native instructional buttons in the bottom left of the screen using scaleform
 * Example:
 * ```typescript
 * import { InstructionalButtons, Control } from '@nativewrappers/client';
 *
 * const buttons = new InstructionalButtons([
 *  {control: Control.Context, label: "Interact with Bob"},
 *  {control: Control.Detonate, label: "Say hello to Alice"}
 * ])
 *
 * setTick(() => {
 *   buttons.draw()
 * })
 * ```
 */
export class InstructionalButtons {
  private scaleform: Scaleform;
  private counter = 0;

  /**
   * Draws native instructional buttons
   *
   * @param buttons Array of instructional buttons to be drawn
   */
  constructor(buttons: IButton[]) {
    this.scaleform = new Scaleform('INSTRUCTIONAL_BUTTONS');
    this.scaleform.callFunction('CLEAR_ALL');
    this.scaleform.callFunction('SET_CLEAR_SPACE', 200);

    buttons.forEach(button => {
      this.pushButton(button);
    });

    this.scaleform.callFunction('DRAW_INSTRUCTIONAL_BUTTONS');
    this.scaleform.callFunction('SET_BACKGROUND_COLOUR', 0, 0, 0, 80);
  }

  private pushButton(button: IButton) {
    this.scaleform.callFunction(
      'SET_DATA_SLOT',
      this.counter,
      GetControlInstructionalButton(2, button.control, true),
      button.label,
    );
    this.counter++;
  }

  public async draw(): Promise<void> {
    await this.scaleform.render2D();
  }
}
