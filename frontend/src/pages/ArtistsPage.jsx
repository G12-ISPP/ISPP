import React from 'react'
import ArtistsGrid, { GRID_TYPES } from '../components/ArtistsGrid/ArtistsGrid'
import PageTitle from '../components/PageTitle/PageTitle'

const ArtistsPage = () => {
  return (
    <div>
      <PageTitle title="Diseñadores" />
      <ArtistsGrid gridType={GRID_TYPES.UNLIMITED} />
    </div>
  )
}

export default ArtistsPage