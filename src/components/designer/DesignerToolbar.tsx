'use client'

/**
 * Designer Toolbar
 * ZCobans Visual Designer
 *
 * Toolbar central com controles de device, undo/redo e salvar.
 */

import { DeviceToggle } from './DeviceToggle'
import { UndoRedoButtons } from './UndoRedoButtons'
import { SaveButton } from './SaveButton'

export function DesignerToolbar() {
  return (
    <div className="flex items-center gap-4">
      <DeviceToggle />
      <div className="h-4 w-px bg-slate-700" />
      <UndoRedoButtons />
      <div className="h-4 w-px bg-slate-700" />
      <SaveButton />
    </div>
  )
}
