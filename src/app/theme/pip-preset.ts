import { definePreset, palette } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

import { PIP_TOKENS } from './pip-tokens';

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
          mutedColor: PIP_TOKENS.text.muted,
          hoverMutedColor: PIP_TOKENS.text.soft,
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
