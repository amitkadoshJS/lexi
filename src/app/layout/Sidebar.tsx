import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import TranslateIcon from "@mui/icons-material/Translate";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import PeopleIcon from "@mui/icons-material/People";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import { NavLink } from "react-router-dom";

const links = [
  { label: "Categories", icon: <CategoryIcon />, to: "/categories" },
  { label: "Words", icon: <ViewModuleIcon />, to: "/words" },
  { label: "Worlds", icon: <AutoAwesomeMosaicIcon />, to: "/worlds" },
  { label: "Users", icon: <PeopleIcon />, to: "/users" },
  { label: "Langs", icon: <TranslateIcon />, to: "/langs" }
];

const Sidebar = ({ drawerWidth }: { drawerWidth: number }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" }
      }}
    >
      <Toolbar />
      <List>
        {links.map((link) => (
          <ListItemButton
            key={link.to}
            component={NavLink}
            to={link.to}
            sx={{
              "&.active": {
                backgroundColor: "rgba(26, 115, 232, 0.1)",
                "& .MuiListItemIcon-root": { color: "primary.main" }
              }
            }}
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
