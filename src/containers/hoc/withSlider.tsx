import { createRef, useEffect, useState, FunctionComponent } from "react";
import Slider from "react-slick";
import clsx from 'clsx';
import { makeStyles, Typography, useTheme, useMediaQuery, ButtonBase } from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { PaginatedData, PaginatedResponse } from "../../types/common";

const withSlider = <S, T,>(
  Component: FunctionComponent<{
    data: T,
    popover: boolean,
  }>,
  getTitle: (param?: S) => string | undefined,
  getKey: (item: T) => number,
  fetcher: (param?: S, pageNumber?: number) => Promise<PaginatedResponse<T>>,
) => ({
  data: param,
  showErrorMessage,
}: {
  data?: S,
  showErrorMessage: (message: string) => void,
}) => {
    const classes = useStyles();

    // handling media
    const theme = useTheme();
    const belowSm = useMediaQuery(theme.breakpoints.down('sm'));

    const slider = createRef<Slider>();
    const [slideIndex, setSlideIndex] = useState(0);

    const [data, setData] = useState<PaginatedData<T>>({
      data: [],
      pagesFetched: 0,
      totalPages: 0,
    });

    useEffect(() => {
      if (data.pagesFetched === 0) {
        // fetch the data for the first time, which is the first page
        // here we will populate additional information as well
        (async () => {
          const result = await fetcher(param);
          if (result.error) {
            // error occurred
            showErrorMessage(result.error.message);
          } else {
            setData({
              data: result.data,
              pagesFetched: 1,
              totalPages: result.totalPages,
            });
          }
        })();
      }
    }, [data, param, showErrorMessage]);

    const onSliderChange = async (index: number) => {
      const slides = belowSm ? 2 : 5;
      setSlideIndex(index);
      if (index >= (data.data.length - 2 * slides)) {
        // in this case we need to fetch the next page
        // when we are on the second last page
        const result = await fetcher(param, data.pagesFetched + 1);
        if (result.error) {
          // error occurred
          showErrorMessage(result.error.message);
          return;
        }
        setData({
          ...data,
          data: [...data.data, ...result.data],
          pagesFetched: data.pagesFetched + 1,
        });
      }
    };

    const renderCardWithLeftButton = (item: T) => (
      <ButtonBase
        focusRipple
        key={getKey(item)}
        className={classes.buttonCard}
        onClick={() => slider.current?.slickPrev()}
        focusVisibleClassName={classes.focusVisibleButtonCard}
      >
        <span className={classes.backdrop} />
        <Component
          data={item}
          popover={false}
        />
        <ChevronLeft
          // color="secondary"
          fontSize={belowSm ? "small" : "large"}
          className={clsx(classes.button, classes.leftButton)}
        />
      </ButtonBase>
    );

    const renderCardWithRightButton = (item: T) => (
      <ButtonBase
        focusRipple
        key={getKey(item)}
        className={classes.buttonCard}
        focusVisibleClassName={classes.focusVisibleButtonCard}
        onClick={() => slider.current?.slickNext()}
      >
        <span className={classes.backdrop} />
        <ChevronRight
          // color="secondary"
          fontSize={belowSm ? "small" : "large"}
          className={clsx(classes.button, classes.rightButton)}
        />
        <Component
          data={item}
          popover={false}
        />
      </ButtonBase>
    );

    const renderCard = (slides: number) => (item: T, index: number) => {
      const total = data.data.length;
      const left = slideIndex - Math.floor(slides / 2);
      const right = slideIndex + Math.floor((slides - 1) / 2);
      const leftButtonIndex = (left - 1 + total) % total;
      const rightButtonIndex = (right + 1) % total;
      if (index === leftButtonIndex) {
        // render with left button
        return renderCardWithLeftButton(item);
      }
      if (index === rightButtonIndex) {
        // render with right button
        return renderCardWithRightButton(item);
      }
      return (
        <Component
          key={getKey(item)}
          data={item}
          popover={(index >= left && index <= right) ||
            (left < 0 && (index >= (left + total) || index <= right)) ||
            (right >= total && (index >= left || index <= right % total))}
        />
      );
    };

    const renderSlider = (slides: number) => (
      <Slider
        ref={slider}
        className={classes.slider}
        infinite
        centerMode
        lazyLoad="progressive"
        slidesToShow={slides}
        slidesToScroll={slides}
        afterChange={onSliderChange}
      >
        {data.data.map(renderCard(slides))}
      </Slider>
    );

    return (
      <div className={classes.root}>
        <Typography component="h5" variant="h6" className={classes.title}>{getTitle(param)}</Typography>
        <div className={classes.page}>
          {belowSm && renderSlider(2)}
          {!belowSm && renderSlider(5)}
        </div>
      </div>
    );
  };

export default withSlider;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  title: {
    margin: theme.spacing(1, 4, 1),
  },
  page: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
  },
  buttonCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    '&:hover': {
      opacity: 0.4,
    },
    '&:hover, &$focusVisible': {
      '& $button': {
        opacity: 1,
      },
      '& $backdrop': {
        opacity: 0.15,
      },
    },
  },
  focusVisibleButtonCard: {},
  backdrop: {
    margin: theme.spacing(0, 2, 0),
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
  },
  button: {
    zIndex: 1,
    opacity: 0,
    transition: theme.transitions.create('opacity'),
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
  },
  leftButton: {
    right: theme.spacing(2),
  },
  rightButton: {
    left: theme.spacing(2),
  },
}));
