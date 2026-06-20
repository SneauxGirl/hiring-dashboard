import { definePreset, palette } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

import { PIP_PALETTE, PIP_TOKENS } from './pip-tokens';

const purple = PIP_PALETTE.purple;

/** PrimeNG base preset: Lara. Locked — do not switch to Nora, Aura, or another preset without explicit user approval. */
export const PipPreset = definePreset(Lara, {
  semantic: {
    primary: palette(PIP_TOKENS.primary),
    overlay: {
      select: { shadow: PIP_TOKENS.shadow.select },
      popover: { shadow: PIP_TOKENS.shadow.popover },
      modal: { shadow: PIP_TOKENS.shadow.modal },
      navigation: { shadow: PIP_TOKENS.shadow.navigation },
    },
    colorScheme: {
      light: {
        surface: {
          0: PIP_TOKENS.surface.card,
          50: PIP_TOKENS.surface.page,
          100: PIP_TOKENS.surface.hover,
          200: PIP_TOKENS.surface.border,
        },
        text: {
          color: PIP_TOKENS.text.color,
          hoverColor: PIP_TOKENS.text.hoverColor,
          mutedColor: PIP_TOKENS.text.mutedColor,
          hoverMutedColor: PIP_TOKENS.text.hoverMutedColor,
        },
        primary: {
          color: purple.solid,
          hoverColor: purple.solid,
          activeColor: purple.solid,
        },
        highlight: {
          background: purple.fill,
          focusBackground: purple.fill,
          color: purple.solid,
          focusColor: purple.solid,
        },
        formField: {
          hoverBorderColor: purple.solid,
          focusBorderColor: purple.solid,
          floatLabelFocusColor: purple.solid,
        },
      },
    },
  },
  components: {
    card: {
      root: {
        shadow: PIP_TOKENS.shadow.card,
      },
    },
  },
});
