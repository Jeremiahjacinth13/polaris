import React from 'react';

import {Item} from '../Item';
import {Box} from '../../../Box';
import {Text} from '../../../Text';
import type {
  ActionListItemDescriptor,
  ActionListSection,
} from '../../../../types';
import {HorizontalStack} from '../../../HorizontalStack';
import {VerticalStack} from '../../../VerticalStack';

export interface SectionProps {
  /** Section of action items */
  section: ActionListSection;
  /** Should there be multiple sections */
  hasMultipleSections: boolean;
  /** Defines a specific role attribute for each action in the list */
  actionRole?: 'option' | 'menuitem' | string;
  /** Callback when any item is clicked or keypressed */
  onActionAnyItem?: ActionListItemDescriptor['onAction'];
  /** Whether it is the first in a group of sections */
  isFirst?: boolean;
}

export function Section({
  section,
  hasMultipleSections,
  isFirst,
  actionRole,
  onActionAnyItem,
}: SectionProps) {
  const handleAction = (itemOnAction: ActionListItemDescriptor['onAction']) => {
    return () => {
      if (itemOnAction) {
        itemOnAction();
      }
      if (onActionAnyItem) {
        onActionAnyItem();
      }
    };
  };
  const actionMarkup = section.items.map(
    ({content, helpText, onAction, ...item}, index) => {
      const itemMarkup = (
        <Item
          content={content}
          helpText={helpText}
          role={actionRole}
          onAction={handleAction(onAction)}
          {...item}
        />
      );

      return (
        <Box
          as="li"
          key={`${content}-${index}`}
          role={actionRole === 'menuitem' ? 'presentation' : undefined}
        >
          <HorizontalStack wrap={false}>{itemMarkup}</HorizontalStack>
        </Box>
      );
    },
  );

  let titleMarkup: string | React.ReactNode = null;

  if (section.title) {
    titleMarkup =
      typeof section.title === 'string' ? (
        <Box
          paddingBlockStart="3"
          paddingBlockEnd="1"
          paddingInlineStart="3"
          paddingInlineEnd="3"
        >
          <Text as="p" variant="headingSm">
            {section.title}
          </Text>
        </Box>
      ) : (
        <Box padding="2" paddingInlineEnd="1_5-experimental">
          {section.title}
        </Box>
      );
  }

  let sectionRole: 'menu' | 'presentation' | undefined;
  switch (actionRole) {
    case 'option':
      sectionRole = 'presentation';
      break;
    case 'menuitem':
      sectionRole = !hasMultipleSections ? 'menu' : 'presentation';
      break;
    default:
      sectionRole = undefined;
      break;
  }

  const sectionMarkup = (
    <>
      {titleMarkup}
      <Box
        as="div"
        padding="1_5-experimental"
        {...(hasMultipleSections && {paddingBlockStart: '0'})}
        tabIndex={!hasMultipleSections ? -1 : undefined}
      >
        <VerticalStack
          gap="1"
          as="ul"
          {...(sectionRole && {role: sectionRole})}
        >
          {actionMarkup}
        </VerticalStack>
      </Box>
    </>
  );

  return hasMultipleSections ? (
    <Box
      as="li"
      role="presentation"
      borderColor="border-subdued"
      {...(!isFirst && {borderBlockStartWidth: '1'})}
      {...(!section.title && {
        paddingBlockStart: '1_5-experimental',
      })}
    >
      {sectionMarkup}
    </Box>
  ) : (
    sectionMarkup
  );
}
