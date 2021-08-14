import { Button, Menu, MenuItem } from "@material-ui/core";
import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { CONTENT_ROUTES } from "../constants/routes";

const Browse = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const onClick = (event: MouseEvent<HTMLButtonElement>) =>
    setAnchor(event.currentTarget);

  const onClose = () => setAnchor(null);

  const renderButton = () => (
    <Button
      aria-controls="browse"
      aria-haspopup={anchor ? "true" : undefined}
      onClick={onClick}
      color="secondary"
    >
      {t("browse")}
    </Button>
  );

  const renderMenu = () => (
    <Menu
      id="profile-photo"
      open={!!anchor}
      anchorEl={anchor}
      onClose={onClose}
    >
      {CONTENT_ROUTES.map(({ title, location }) => (
        <MenuItem
          key={title}
          disabled={history.location.pathname === location}
          onClick={() => history.replace(location)}
        >
          {t(title)}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <div>
      {renderButton()}
      {renderMenu()}
    </div>
  );
};

export default Browse;
