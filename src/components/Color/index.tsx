
import React, { useState, useEffect } from 'react'
import { SketchPicker } from 'react-color';
import classnames from 'classnames'
import styles from './index.less'

interface ColorProps{
  size?: 'small' | 'middle' | 'large'
  setColor: Function;
  defaultColor?: string;
  align?: 'left' | 'right'
}
const Color: React.FC<ColorProps> = (props) => {
  const { setColor, defaultColor, size, align='left' } = props;
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState(defaultColor || '#F3B74B')

  useEffect(()=>{
    setBackgroundColor(defaultColor as string)
  }, [defaultColor])

  return (
    <div className={classnames({
      [styles.colorBox]: true,
      [styles.small]: size === 'small',
    })}>
      <div className={styles.swatch} onClick={() => {
        setDisplayColorPicker(true)
      }} >
        <div className={styles.hex}>{backgroundColor}</div>
        <div className={styles.color} style={{ backgroundColor: backgroundColor }} />
      </div>
      {displayColorPicker ? <div className={classnames({
        [styles.popover]: true,
        [styles.left]: align === 'left',
        [styles.right]: align === 'right',
      })}>
        <div className={styles.cover} onClick={() => setDisplayColorPicker(false)} />
        <SketchPicker color={backgroundColor} onChange={(color) => {
          let hex = color.hex || '';
          let hexUpperCase = hex.toLocaleUpperCase();
          setBackgroundColor(hexUpperCase)
          setColor(hexUpperCase)
        }} />
      </div> : null}
    </div>
  )
}

export default Color;