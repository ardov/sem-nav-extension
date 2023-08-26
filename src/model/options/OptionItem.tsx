import { type Option } from '@src/model/options/options'
import React, { FC } from 'react'
import { Command } from 'cmdk'

export const OptionItem: FC<{
  option: Option
  isFav?: boolean
  onSelect: () => void
}> = props => {
  const { option, isFav, onSelect } = props
  const { name, RenderName: renderName, iconUrl, id, icon } = option
  return (
    <Command.Item value={id} onSelect={onSelect}>
      {isFav && '★ '}
      {renderName ? renderName() : name}
      {iconUrl ? (
        <img
          src={iconUrl}
          alt=""
          style={{
            width: 24,
            height: 24,
            position: 'absolute',
            left: 8,
            top: 8,
            borderRadius: 4,
          }}
        />
      ) : icon ? (
        <div
          style={{
            width: 24,
            height: 24,
            position: 'absolute',
            left: 8,
            top: 8,
            borderRadius: 4,
            verticalAlign: 'middle',
            textAlign: 'center',
            fontSize: '20px',
          }}
        >
          {icon}
        </div>
      ) : null}
    </Command.Item>
  )
}
