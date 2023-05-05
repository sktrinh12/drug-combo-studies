import IconButton from '@mui/material/IconButton'
import HomeIcon from '@mui/icons-material/Home'
import { Link } from 'react-router-dom'

const GoHomeIcon = () => {
  return (
    <IconButton size='large' component={Link} to='/'>
      <HomeIcon />
    </IconButton>
  )
}

export default GoHomeIcon
