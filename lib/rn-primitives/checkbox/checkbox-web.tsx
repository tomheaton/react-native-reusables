import * as Checkbox from '@radix-ui/react-checkbox';
import React from 'react';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import { useAugmentedRef } from '../hooks/useAugmentedRef';
import * as Slot from '../slot';
import type {
  ComponentPropsWithAsChild,
  PressableRef,
  SlottablePressableProps,
} from '../types';
import type { CheckboxIndicator, CheckboxRootProps } from './types';

const Root = React.forwardRef<
  PressableRef,
  SlottablePressableProps & CheckboxRootProps
>(
  (
    {
      asChild,
      disabled = false,
      checked,
      onCheckedChange,
      onPress: onPressProp,
      role: _role,
      ...props
    },
    ref
  ) => {
    const augmentedRef = React.useRef<PressableRef>(null);
    useAugmentedRef({ augmentedRef, ref });

    function onPress(ev: GestureResponderEvent) {
      onPressProp?.(ev);
      onCheckedChange(!checked);
    }

    React.useEffect(() => {
      if (augmentedRef.current) {
        const augRef = augmentedRef.current as unknown as HTMLButtonElement;
        augRef.dataset.state = checked ? 'checked' : 'unchecked';
        augRef.type = 'button';
        augRef.role = 'checkbox';
        augRef.value = checked ? 'on' : 'off';
      }
    }, [checked]);

    const Component = asChild ? Slot.Pressable : Pressable;
    return (
      <Checkbox.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        asChild
      >
        <Component
          ref={augmentedRef}
          role='button'
          onPress={onPress}
          disabled={disabled}
          {...props}
        />
      </Checkbox.Root>
    );
  }
);

Root.displayName = 'RootWebCheckbox';

const Indicator = React.forwardRef<
  React.ElementRef<typeof View>,
  ComponentPropsWithAsChild<typeof View> & CheckboxIndicator
>(({ asChild, forceMount, ...props }, ref) => {
  const Component = asChild ? Slot.View : View;
  return (
    <Checkbox.Indicator forceMount={forceMount} asChild>
      <Component ref={ref} {...props} />
    </Checkbox.Indicator>
  );
});

Indicator.displayName = 'IndicatorWebCheckbox';

export { Indicator, Root };