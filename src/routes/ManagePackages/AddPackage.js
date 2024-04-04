import { Card, Empty, Tabs, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import _ from "lodash";
import { STATUS } from "../../Constants";
import { useAuthUser } from "../../App/Context";
import {
  getSinglePackageAction,
  resetAddPackage,
  resetGetSinglePkg,
} from "../../redux/reducers/packages";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { PackageOffers } from "./PackageOffers";
import { PackageDetails } from "./PackageDetails";
import { PackageContent } from "./PackageContent";
import { PackagePreview } from "./PackagePreview";

import { InsertRowBelowOutlined, EditOutlined } from "@ant-design/icons";
import { PricingDetail } from "./PricingDetail";

export const AddPackage = () => {
  const contentTypes = [
    { id: 1, type: "COURSE" },
    { id: 2, type: "BOOK" },
    { id: 3, type: "DRIVE" },
    { id: 4, type: "MAGAZINE" },
    { id: 6, type: "TEST" },
  ];
  const websiteContentTypes = [
    { id: 1, type: "audio" },
    { id: 2, type: "video" },
    { id: 3, type: "pdf" },
    { id: 4, type: "book" },
  ];
  const dispatch = useDispatch();
  const params = useParams();
  const auth = useAuthUser();
  const history = useHistory();
  const location = useLocation();

  const [preview, changePreview] = useState(params.preview ? true : false);

  const { configData, packages } = useSelector((state) => ({
    configData: state.lmsConfig,
    packages: state.packages,
  }));

  const [defaultSyllabus, setDefaultSyllabus] = useState({ exams: [] });
  const [updateData, setUpdateData] = useState();

  useEffect(() => {
    return () => {
      dispatch(resetAddPackage());
    };
  }, [dispatch]);

  useEffect(() => {
    if (packages.getSinglePackgStatus === STATUS.SUCCESS) {
      const currentPkg = packages.currentPackage;
      const data = {
        name: currentPkg.name,
        exams: currentPkg.exams,
        targetYear: currentPkg.targetYear,
        description: currentPkg.description,
        medium: currentPkg.medium,
        published: currentPkg.published,
        price: currentPkg.price,
        fakePrice: currentPkg.fakePrice,
        mode: currentPkg.mode,
        priority: currentPkg.priority,
        type: currentPkg.type,
        availabilityMode: currentPkg.availabilityMode,
        tags: currentPkg.tags,
        carousel: currentPkg.carousel,
        gst: currentPkg.gst,
        slug: currentPkg.slug,
        rating: currentPkg.rating,
        files: currentPkg.files,
        startDate: currentPkg.startDate,
        endDate: currentPkg.endDate,
        thumbnail: currentPkg.thumbnail,
        terms: currentPkg.terms,
        altName: currentPkg.altName,
        timetable: currentPkg.timetable,
        centers: currentPkg.centers || [],
        leadCaptureEnabled: currentPkg.leadCaptureEnabled,
        leadDisabledDays: currentPkg.leadDisabledDays,
        smsExamName: currentPkg.smsExamName,
        smsLink: currentPkg.smsLink,
        websiteContentType: currentPkg.websiteContentType,
        showAsRelevant: currentPkg.showAsRelevant,
        showOnHome: currentPkg.showOnHome,
        walletApplicable: currentPkg.walletApplicable,
        packageContentType: currentPkg.packageContentType,
        batches: currentPkg.batches,
      };
      setUpdateData(data);
    } else {
      setUpdateData(null);
    }
  }, [packages.currentPackage, packages.getSinglePackgStatus]);

  useEffect(() => {
    if (location.pathname === "/add-package") dispatch(resetGetSinglePkg());
  }, [location, dispatch]);

  useEffect(() => {
    if (params.id)
      dispatch(getSinglePackageAction({ id: params.id, admin: true }));
  }, [dispatch, params.id]);

  // console.log('location', location)
  useEffect(() => {
    if (configData.defaultDataStatus == STATUS.SUCCESS) {
      let defaultData = configData.defaultData;
      if (defaultData) setDefaultSyllabus({ exams: defaultData.exams }); //_.intersectionBy(defaultData.exams, data.exams.map(d => ({_id:d})), '_id')})
    }
  }, [configData.defaultData, configData.defaultDataStatus]);

  const changeStep = (e) => {
    if (packages.currentPackage)
      history.push(`/update-package/${e}/${packages.currentPackage._id}`);
  };

  const changePreviewData = () => {
    if (preview) {
      changePreview(false);
      history.push(`/update-package/1/${params.id}`);
    } else {
      changePreview(true);
      history.push(`/preview-package/${packages.currentPackage._id}/true`);
    }
  };

  return (
    <div>
      <CommonPageHeader
        title="Package"
        extra={
          packages?.currentPackage?._id ? (
            <Button
              shape="round"
              icon={!preview ? <InsertRowBelowOutlined /> : <EditOutlined />}
              onClick={() => changePreviewData()}
              size="large"
            >
              {!preview ? "Preview Package" : "Edit Package"}
            </Button>
          ) : null
        }
      />
      <br />
      <Card loading={configData.defaultDataStatus == STATUS.FETCHING}>
        {configData.defaultDataStatus == STATUS.SUCCESS ? (
          !preview ? (
            <Tabs
              type="card"
              centered
              activeKey={params.step}
              onChange={changeStep}
            >
              <Tabs.TabPane
                tab={
                  <div
                    style={{
                      fontSize: "16px",
                      textAlign: "center",
                      padding: "10px",
                      minWidth: "150px",
                    }}
                  >
                    <b>Step 1</b>
                    <br /> Package Details
                  </div>
                }
                key="1"
              >
                <PackageDetails
                  contentTypes={contentTypes}
                  params={params}
                  updateData={updateData}
                  auth={auth}
                  defaultSyllabus={defaultSyllabus}
                  websiteContentTypes={websiteContentTypes}
                />
              </Tabs.TabPane>
              {packages.currentPackage?.name ? (
                <Tabs.TabPane
                  tab={
                    <div
                      style={{
                        fontSize: "16px",
                        textAlign: "center",
                        padding: "10px",
                        minWidth: "150px",
                      }}
                    >
                      <b>Step 2</b>
                      <br />
                      Pricing Details
                    </div>
                  }
                  key="2"
                >
                  <PricingDetail currentPackage={packages.currentPackage} />
                </Tabs.TabPane>
              ) : null}
              {packages.currentPackage?.name ? (
                <Tabs.TabPane
                  tab={
                    <div
                      style={{
                        fontSize: "16px",
                        textAlign: "center",
                        padding: "10px",
                        minWidth: "150px",
                      }}
                    >
                      <b>Step 3</b>
                      <br /> Package Offers
                    </div>
                  }
                  key="3"
                >
                  <PackageOffers currentPackage={packages.currentPackage} />
                </Tabs.TabPane>
              ) : null}
              {packages.currentPackage?.name ? (
                <Tabs.TabPane
                  tab={
                    <div
                      style={{
                        fontSize: "16px",
                        textAlign: "center",
                        padding: "10px",
                        minWidth: "150px",
                      }}
                    >
                      <b>Step 4</b>
                      <br /> Assign Content
                    </div>
                  }
                  key="4"
                >
                  <PackageContent
                    contentTypes={contentTypes}
                    currentPackage={packages.currentPackage}
                  />
                </Tabs.TabPane>
              ) : null}
            </Tabs>
          ) : (
            <PackagePreview
              contentTypes={contentTypes}
              currentPackage={packages.currentPackage}
            />
          )
        ) : (
          <Empty />
        )}
      </Card>
    </div>
  );
};
