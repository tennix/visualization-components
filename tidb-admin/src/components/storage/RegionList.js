import React from 'react'

import _ from 'lodash'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { ViewTitle } from 'react-admin/lib'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import ListSubheader from '@material-ui/core/ListSubheader'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Crop54Icon from '@material-ui/icons/Crop54'

const RegionList = ({ regions, classes }) => (
  <GridList cellHeight={'auto'} className={classes.gridList} cols={3}>
    <GridListTile key="Subheader" cols={3} style={{ height: 'auto' }}>
      <ListSubheader component="h2" className={classes.subheader}>
        TiKV Region List
      </ListSubheader>
    </GridListTile>
    {_.map(regions, item => (
      <Card key={item.id} className={classes.card}>
        <ViewTitle title={`Region: ${item.id}`} />
        <CardContent>
          {_.map(item, (value, key) => {
            console.log(value)
            console.log(_.isObject(value))
            if (!_.isObject(value))
              return (
                <p key={`${key}-${value}`}>
                  {_.startCase(key)}: {value}
                </p>
              )
            if (key === 'epoch')
              return (
                <p key={`epoch-${value.conf_ver}-${value.version}`}>
                  {_.startCase('conf_ver')}: {value.conf_ver},{' '}
                  {_.startCase('version')}: {value.version}
                </p>
              )
            if (key === 'peers')
              return (
                <div
                  key={`peers-${value[0].id}-${value[0].store_id}`}
                  className={classes.row}
                >
                  Peers:
                  {_.map(value, v => (
                    <Tooltip title={`Peer#${v.id}, Store#${v.store_id}`}>
                      <IconButton
                        aria-label={`Peer#${v.id}, Store#${v.store_id}`}
                      >
                        <Crop54Icon />
                      </IconButton>
                    </Tooltip>
                  ))}
                </div>
              )
          })}
        </CardContent>
      </Card>
    ))}
  </GridList>
)

export default RegionList
