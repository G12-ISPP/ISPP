import React from 'react'
import ArtistsGrid, { GRID_TYPES } from '../components/ArtistsGrid/ArtistsGrid'

const ArtistsPage = () => {
  return (
    <div>
      <ArtistsGrid gridType={GRID_TYPES.UNLIMITED} />
    </div>
  )
}

export default ArtistsPage