import React from "react";
import { connect } from "react-redux";
import Typography from '@material-ui/core/Typography';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { TextInput } from "components/FormInputs";
import { withSettingsContext } from "contexts/Settings";




class Widget extends React.Component {

	state={
		error: false,
		helperTexts: {},
		socialMedias:{
			facebook: "Facebook",
			twitter: "Twitter",
			instagram: "Instagram",
			youtube: "Youtube",
			linkedin: "LinkedIn",
			whatsapp: "Whatsapp",
			google_plus: "Google+",
			pinterest: "Pinterest",
		},
		settingsContext: { 
			settings: { 
				social: {},
			},
		},
	};

	constructor(props) {
		super(props);
		this.state.settingsContext = this.props.settingsContext;
		this.handleOnChange = this.handleOnChange.bind(this);
	}

	getSnapshotBeforeUpdate(prevProps) {
		this.mounted = false;
		return { updateContextRequired: !Object.areEqual(prevProps.context, this.props.context) };
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.mounted = true;
		if (snapshot.updateContextRequired) {
			this.setState({settingsContext: this.props.settingsContext});
		}
	} 

	handleOnChange = name => value => {
		const { updateContextSettings } = this.props;
		const { settingsContext:{settings, updateSettings} } = this.state;
		let socialSettings = JSON.fromJSON(settings.social);		
		socialSettings[name] = value;
		updateSettings("Social", socialSettings).then(newContext => {
			this.setState(prevState=>({helperTexts: {...prevState.helperTexts, [name]: "Saved"}}));

		});
	}

	render() {
		const { settingsContext: { settings }, socialMedias, helperTexts } = this.state;
		const socialSettings = JSON.isJSON(settings.social)? settings.social : {};
		return (
			<GridContainer className="px-2">
				{Object.entries(socialMedias).map(([key, value], index) => (
					<GridItem xs={12} key={"social-"+index}>
						<TextInput
							name={key}
							label={value}
							type="text"
							defaultValue={socialSettings[key]}
							onChange={this.handleOnChange(key)}
							helperText={helperTexts[key]}						
						/>
					</GridItem>
				))}				
			</GridContainer>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav,
});


export default withSettingsContext(connect(mapStateToProps, {} )(Widget));
