import React from 'react';
import PropTypes from 'prop-types';
import { compose } from "recompose";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SmtpSettings from './SMTP';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `mail-settings-tab-${index}`,
		'aria-controls': `mail-settings-tabpanel-${index}`,
	};
}

const styles = theme => ({
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper,
	},
});


function Widget(props) {
	const { classes } = props;
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<div className={classes?.root}>
			<Tabs
				value={value}
				onChange={handleChange}
				indicatorColor="primary"
				textColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				aria-label="mail settings tabs"
			>
				<Tab label="SMTP" {...a11yProps(0)} />
				<Tab label="Templates" {...a11yProps(1)} />
			</Tabs>
			<TabPanel value={value} index={0}>
				<SmtpSettings />
			</TabPanel>
			<TabPanel value={value} index={1}>
				Templates
			</TabPanel>

		</div>
	);
}

export default compose()(React.memo(Widget));