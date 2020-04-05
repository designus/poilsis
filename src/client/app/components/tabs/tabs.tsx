import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { TabProps, TabOption, DefaultProps } from './types';

export function SimpleTabs(props: TabProps) {
  const [value, setValue] = useState(props.value);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    props.onChange(newValue);
  };

  const a11yProps = (index: number) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  });

  const renderTabLabel = (option: TabOption, index: number) => (
    <Tab label={option.label} {...a11yProps(index)} />
  );

  const renderTabContent = (option: TabOption, index: number) => (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box p={3}>{option.content}</Box>}
    </Typography>
  );

  const renderTabLabels = () => props.options.map(renderTabLabel);

  const renderTabContents = () => props.options.map(renderTabContent);

  return (
    <div>
      <Paper square>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          onChange={handleChange}
          aria-label="Tabs"
        >
          {renderTabLabels()}
        </Tabs>
      </Paper>
      {renderTabContents()}
    </div>
  );
}

SimpleTabs.defaultProps = {
  value: 0,
  onChange: (value: number) => value
} as DefaultProps;
