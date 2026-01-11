import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../hooks/useAuth";

const Topbar = ({ drawerWidth }: { drawerWidth: number }) => {
  const { user, signOut } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, ml: `${drawerWidth}px` }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap>
          Lexi Admin
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2">{user?.email ?? ""}</Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={signOut}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
