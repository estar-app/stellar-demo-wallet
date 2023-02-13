import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader, TextLink, Modal, Icon, IconButton, } from "@stellar/design-system";
import { ConfirmAssetAction } from "components/ConfirmAssetAction";
import { HomeDomainOverrideModal } from "components/HomeDomainOverrideModal";
import { CSS_MODAL_PARENT_ID } from "demo-wallet-shared/build/constants/settings";
import { setActiveAssetAction, resetActiveAssetAction, } from "ducks/activeAsset";
import { log } from "demo-wallet-shared/build/helpers/log";
import { searchParam } from "demo-wallet-shared/build/helpers/searchParam";
import { ActionStatus, SearchParams } from "types/types.d";
import { useRedux } from "hooks/useRedux";
export const HomeDomainOverrideButtons = ({ asset }) => {
    const [activeModal, setActiveModal] = useState("");
    const { assetOverrides } = useRedux("assetOverrides");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let ModalType;
    (function (ModalType) {
        ModalType["REMOVE_ASSET_OVERRIDE"] = "REMOVE_ASSET_OVERRIDE";
        ModalType["ASSET_OVERRIDE"] = "ASSET_OVERRIDE";
    })(ModalType || (ModalType = {}));
    const showModal = (modalType) => {
        setActiveModal(modalType);
        let activeAsset;
        switch (modalType) {
            case ModalType.ASSET_OVERRIDE:
                activeAsset = {
                    assetString: asset.assetString,
                    title: "",
                    callback: () => {
                    },
                };
                break;
            case ModalType.REMOVE_ASSET_OVERRIDE:
                activeAsset = {
                    assetString: asset.assetString,
                    title: `Remove ${asset.assetCode} home domain override`,
                    description: `Asset ${asset.assetCode}’s home domain ${asset.homeDomain} override will be removed. Original home domain will be used, if it exists.`,
                    callback: handleRemove,
                };
                break;
            default:
        }
        dispatch(setActiveAssetAction(activeAsset));
    };
    const handleRemove = () => {
        navigate(searchParam.removeKeyPair({
            param: SearchParams.ASSET_OVERRIDES,
            itemId: asset.assetString,
        }));
        log.instruction({
            title: `Asset’s ${asset.assetCode} home domain override \`${asset.homeDomain}\` removed`,
        });
        handleCloseModal();
    };
    const handleCloseModal = () => {
        setActiveModal("");
        dispatch(resetActiveAssetAction());
    };
    if (assetOverrides.status === ActionStatus.PENDING) {
        return React.createElement(Loader, null);
    }
    return (React.createElement(React.Fragment, null,
        asset.homeDomain ? (React.createElement(IconButton, { icon: React.createElement(Icon.Edit2, null), altText: "Edit home domain", onClick: () => showModal(ModalType.ASSET_OVERRIDE) })) : (React.createElement(TextLink, { onClick: () => showModal(ModalType.ASSET_OVERRIDE) }, "Add home domain")),
        asset.isOverride && (React.createElement(IconButton, { icon: React.createElement(Icon.XCircle, null), altText: "Remove home domain override", onClick: () => showModal(ModalType.REMOVE_ASSET_OVERRIDE), variant: IconButton.variant.error })),
        React.createElement(Modal, { visible: Boolean(activeModal), onClose: handleCloseModal, parentId: CSS_MODAL_PARENT_ID },
            activeModal === ModalType.REMOVE_ASSET_OVERRIDE && (React.createElement(ConfirmAssetAction, { onClose: handleCloseModal })),
            activeModal === ModalType.ASSET_OVERRIDE && (React.createElement(HomeDomainOverrideModal, { asset: asset, onClose: handleCloseModal })))));
};
//# sourceMappingURL=HomeDomainOverrideButtons.js.map