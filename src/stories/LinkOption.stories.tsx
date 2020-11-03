import { Meta, Story } from '@storybook/react/types-6-0'
import * as React from 'react'
import chatterIcon from '../assets/chatter.svg'
import '../styles/global.scss'

import LinkOption, { ILinkOptionProps } from '../components/LinkOption'

export default {
  title: 'Components/Cards/LinkOption',
  component: LinkOption
} as Meta

const Template: Story<ILinkOptionProps> = (args) => <LinkOption {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Discuss the Lecture',
  text: 'Chat with other students on the forums',
  icon: <img src={chatterIcon} />,
  url: '/'
}
