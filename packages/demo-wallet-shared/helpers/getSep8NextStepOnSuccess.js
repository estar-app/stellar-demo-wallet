import { Sep8ApprovalStatus, Sep8Step } from "../types/types";
export const getSep8NextStepOnSuccess = ({ currentStep, approvalStatus, didUndergoKyc, }) => {
    const nextStepDict = {
        [Sep8Step.DISABLED]: Sep8Step.STARTING,
        [Sep8Step.STARTING]: nextStepAfterApprovalServer({
            currentStep,
            approvalStatus,
        }),
        [Sep8Step.PENDING]: Sep8Step.DISABLED,
        [Sep8Step.TRANSACTION_REVISED]: Sep8Step.COMPLETE,
        [Sep8Step.ACTION_REQUIRED]: Sep8Step.SENT_ACTION_REQUIRED_FIELDS,
        [Sep8Step.SENT_ACTION_REQUIRED_FIELDS]: didUndergoKyc
            ? nextStepAfterApprovalServer({
                currentStep,
                approvalStatus,
            })
            : Sep8Step.STARTING,
        [Sep8Step.COMPLETE]: Sep8Step.DISABLED,
    };
    return nextStepDict[currentStep];
};
const nextStepAfterApprovalServer = ({ currentStep, approvalStatus, }) => {
    const approvalStatusDict = {
        [Sep8ApprovalStatus.ACTION_REQUIRED]: Sep8Step.ACTION_REQUIRED,
        [Sep8ApprovalStatus.PENDING]: Sep8Step.PENDING,
        [Sep8ApprovalStatus.REVISED]: Sep8Step.TRANSACTION_REVISED,
        [Sep8ApprovalStatus.SUCCESS]: Sep8Step.TRANSACTION_REVISED,
        [Sep8ApprovalStatus.REJECTED]: currentStep,
    };
    return approvalStatusDict[approvalStatus];
};
//# sourceMappingURL=getSep8NextStepOnSuccess.js.map