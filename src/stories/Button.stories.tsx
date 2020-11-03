import { Meta, Story } from '@storybook/react/types-6-0'
import * as React from 'react'
import '../styles/global.scss'

import Button, { IButtonProps } from '../components/Button'

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    size: { defaultValue: '', control: { type: 'select', options: ['', 'small', 'large'] } },
    secondary: { type: 'boolean' },
    loading: { type: 'boolean' },
    disabled: { type: 'boolean' },
    inline: { type: 'boolean' },
    success: { type: 'boolean' },
    error: { type: 'boolean' },
  }
} as Meta

const Template: Story<IButtonProps> = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  children: 'Primary'
}

export const Small = Template.bind({})
Small.args = {
  size: 'small',
  children: 'Small'
}

export const Secondary = Template.bind({})
Secondary.args = {
  children: 'Secondary',
  secondary: true
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  children: 'Disabled'
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true,
  children: 'Please wait'
}
