/** @format */
import { fade } from '@material-ui/core/styles';
export default theme => ({
	search: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),

	},
	open: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.black, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.black, 0.25),
		},
		display: 'flex',
		alignItems: 'center',
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
		visibility: "visible",
		//zIndex: theme.zIndex.tooltip,
	},
	searchIcon: {
		color: fade(theme.palette.text.primary, 0.5),
		transition: theme.transitions.create('color'),
		'&:hover': {
			color: theme.palette.text.primary
		},
	},
	inputRoot: {
		color: 'inherit',
		flex: 1,

	},
	resultsMenu: {
		//top: theme.spacing(4),
		flexGrow: 1,
		display: "flex",
		flex: 1,
		flexDirection: "row",
		width: "100%"
	},
	resultsMenuPopoverRoot: {
		display: "flex",
		flex: 1,
		flexDirection: "row",
	},
	resultsMenuPopoverPaper: {
		flexGrow: 1,
		flex: 1,
		//top: theme.spacing(4),
		//width: "100%"
	},
	inputInput: {		
		// vertical padding + font size from searchIcon
		paddingLeft: theme.spacing(1),
		transition: theme.transitions.create('width'),
		width: '100%',
	},
});
