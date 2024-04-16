import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import InfoBox from "../components/info-box";
import { useAppSelector } from "../hooks/storeHooks";
import {
  AnarchyOverlay,
  DemocracyOverlay,
  MonarchyOverlay,
  NamesOverlay,
} from "../components/gameplay-overlay";

type RunPageProps = {
  displayInfobox: boolean;
};

const RunPage = ({ displayInfobox = true }: RunPageProps) => {
  const baseData = useAppSelector((state) => state.config);
  const navigate = useNavigate();

  const overlay = () => {
    switch (baseData.mode) {
      case "democracy":
        return <DemocracyOverlay />;
      case "monarchy":
        return <MonarchyOverlay />;
      case "anarchy":
        return <AnarchyOverlay />;
      case "names":
        return <NamesOverlay />;
      default:
        console.warn("[YTPlays] baseData corrupt..?", baseData);
    }
  };

  const stopAndBack = () => {
    window.mainAPI.stopRun();
    navigate("/");
  };

  if (displayInfobox)
    return (
      <div className="grid grid-cols-5 divide-x mx-2 my-2">
        <div className="col-span-2 pl-2 pr-4">
          <InfoBox />
        </div>
        <div className="flex flex-col flex-grow col-span-3 pl-4 pr-2">
          {overlay()}
          <span className="flex-grow" />
          <div>
            <Button onClick={stopAndBack} className="float-right">
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  else
    return (
      <div className="flex flex-col flex-grow mx-2 my-2">
        {overlay()}
        <span className="flex-grow" />
        <div>
          <Button onClick={stopAndBack} className="float-right">
            Back
          </Button>
        </div>
      </div>
    );
};

export default RunPage;
