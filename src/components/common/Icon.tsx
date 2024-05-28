import React from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'

interface IconProps extends FontAwesomeIconProps {
  icon: IconDefinition
}

/**
 * Icon component that uses FontAwesomeIcon to render an icon.
 * @param {IconProps} props - The props for the Icon component.
 * @param {IconDefinition} props.icon - The icon to render.
 * @returns {JSX.Element} The Icon component.
 * @example
 * ```tsx
 * import { faCoffee } from '@fortawesome/free-solid-svg-icons'
 * import Icon from './Icon'
 *
 * const MyComponent = () => {
 *  return <Icon icon={faCoffee} />
 * }
 * ```
 */
const Icon: React.FC<IconProps> = ({ icon, ...rest }): JSX.Element => {
  return <FontAwesomeIcon icon={icon} {...rest} />
}

export default Icon
