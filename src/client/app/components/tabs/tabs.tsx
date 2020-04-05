import React, { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { TabProps, TabOption, DefaultProps } from './types';
import { useStyles } from './styles';

export function SimpleTabs(props: TabProps) {
  const [value, setValue] = useState(props.value);
  const classes = useStyles(props);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    props.onChange(newValue);
  };

  const a11yProps = (index: number) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  });

  const renderTabLabel = (option: TabOption, index: number) => (
    <Tab key={index} label={option.label} {...a11yProps(index)} />
  );

  const renderTabContent = (option: TabOption, index: number) => (
    <Typography
      key={index}
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && option.content}
    </Typography>
  );

  const renderTabLabels = () => props.options.map(renderTabLabel);

  const renderTabContents = () => props.options.map(renderTabContent);

  return (
    <React.Fragment>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        onChange={handleChange}
        aria-label="Tabs"
        classes={{ root: classes.tabs }}
      >
        {renderTabLabels()}
      </Tabs>
      {renderTabContents()}
    </React.Fragment>
  );
}

SimpleTabs.defaultProps = {
  value: 0,
  onChange: (value: number) => value
} as DefaultProps;
