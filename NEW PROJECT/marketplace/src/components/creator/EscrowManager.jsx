import React, { useState } from 'react';
import {
  Card,
  Steps,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Space,
  Alert,
  message,
  Tooltip,
  Divider,
  Progress
} from 'antd';
import {
  LockOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  SafetyCertificateOutlined,
  PlayCircleOutlined,
  DollarCircleOutlined,
  ExclamationCircleOutlined,
  RightOutlined
} from '@ant-design/icons';

export default function EscrowManager({
  escrowContracts,
  setEscrowContracts
}) {
  const [activeContractId, setActiveContractId] = useState(
    escrowContracts[0]?.id || null
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm] = Form.useForm();

  const currentContract =
    escrowContracts.find(c => c.id === activeContractId) || escrowContracts[0];

  const handleUploadDeliverable = (values) => {
    setEscrowContracts(prev =>
      prev.map(c => {
        if (c.id === currentContract.id) {
          const updatedSteps = [...c.steps];
          updatedSteps[2] = {
            title: "Draft Uploaded",
            desc: "Unlisted link ready for brand review",
            date: "Today"
          };
          return {
            ...c,
            currentStep: 3,
            deliverableUrl: values.previewUrl,
            steps: updatedSteps
          };
        }
        return c;
      })
    );
    message.success('Draft deliverable submitted! Brand notified for review.');
    setIsUploadModalOpen(false);
  };

  const handleRequestRelease = (contractId) => {
    setEscrowContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          return {
            ...c,
            currentStep: 4,
            steps: c.steps.map((s, idx) =>
              idx === 4
                ? { title: "Funds Released", desc: "Payout credited to wallet", date: "Just now" }
                : s
            )
          };
        }
        return c;
      })
    );
    message.success('Brand approved! Funds released to your creator wallet.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Escrow Vault & Deliverable Tracker</span>
            <Tag color="emerald">Protected by Smart Vault</Tag>
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            All brand funds are 100% pre-funded and held in neutral platform escrow before production starts.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <SafetyCertificateOutlined className="text-emerald-400 text-sm" />
          <span className="text-slate-300">
            Total In Escrow: <strong className="text-emerald-400 font-mono">$12,450.00</strong>
          </span>
        </div>
      </div>

      {/* Main Split: Left Contracts List, Right Milestone Workflow */}
      <Row gutter={[24, 24]}>
        {/* Left Column: Contracts Selector */}
        <Col xs={24} lg={8}>
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Active Contracts ({escrowContracts.length})
            </span>

            {escrowContracts.map(contract => {
              const isSelected = contract.id === currentContract?.id;
              return (
                <div
                  key={contract.id}
                  onClick={() => setActiveContractId(contract.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-900/90 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-indigo-400">
                      {contract.brand}
                    </span>
                    <Tag
                      color={contract.modality === 'online' ? 'blue' : 'green'}
                      className="text-[10px] m-0 uppercase font-medium"
                    >
                      {contract.modality}
                    </Tag>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-1">
                    {contract.campaignTitle}
                  </h4>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/70 text-xs">
                    <span className="text-slate-400">
                      Escrow Vault:
                    </span>
                    <span className="font-bold text-emerald-400 font-mono">
                      ${contract.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Stage: {contract.steps[contract.currentStep]?.title}</span>
                    <span className="text-indigo-400 font-medium">Select →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Col>

        {/* Right Column: Detailed Escrow State Machine */}
        <Col xs={24} lg={16}>
          {currentContract ? (
            <Card className="bg-slate-900/90 border-slate-800 shadow-2xl space-y-6">
              {/* Header Box */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {currentContract.campaignTitle}
                    </h3>
                    <Tag color="cyan">{currentContract.packageType}</Tag>
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    Brand Partner: <strong className="text-slate-200">{currentContract.brand}</strong> • Deadline: {currentContract.deadline}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">
                    ${currentContract.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">
                    Net Payout to Creator: <strong className="text-slate-200 font-mono">${currentContract.netPayout.toLocaleString()}</strong> (10% platform fee)
                  </div>
                </div>
              </div>

              {/* AntD Steps Component for State Machine */}
              <div className="py-6 px-2">
                <Steps
                  current={currentContract.currentStep}
                  items={currentContract.steps.map((step, idx) => ({
                    title: <span className="text-slate-200 font-semibold text-xs">{step.title}</span>,
                    description: (
                      <div className="text-[11px] text-slate-400 mt-1">
                        <div>{step.desc}</div>
                        <div className="text-slate-500 font-mono mt-0.5">{step.date}</div>
                      </div>
                    )
                  }))}
                />
              </div>

              {/* Deliverable Section */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <PlayCircleOutlined className="text-red-400" />
                    Video Deliverable Link
                  </span>
                  {currentContract.deliverableUrl ? (
                    <Tag color="success">Uploaded & Verifiable</Tag>
                  ) : (
                    <Tag color="warning">Awaiting Creator Upload</Tag>
                  )}
                </div>

                {currentContract.deliverableUrl ? (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-between gap-3 text-xs">
                    <div className="truncate text-indigo-300 font-mono">
                      {currentContract.deliverableUrl}
                    </div>
                    <Button
                      size="small"
                      href={currentContract.deliverableUrl}
                      target="_blank"
                      className="shrink-0 bg-slate-800 border-slate-700 text-slate-200 text-xs"
                    >
                      Preview Link
                    </Button>
                  </div>
                ) : (
                  <Alert
                    type="info"
                    showIcon
                    message="Production in progress"
                    description="Upload your unlisted 4K YouTube link once script points are fulfilled. The brand has 48 hours to approve or request revision."
                    className="bg-indigo-950/30 border-indigo-800/40 text-slate-300"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white border-none font-semibold shadow-md shadow-indigo-600/30"
                >
                  Upload / Update Deliverable
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => message.info('Dispute Mediation team contacted. Support ticket #ESC-9014 opened.')}
                    className="bg-slate-800 border-slate-700 text-slate-300 text-xs"
                  >
                    Request Mediation
                  </Button>

                  {currentContract.currentStep >= 3 && (
                    <Button
                      type="primary"
                      onClick={() => handleRequestRelease(currentContract.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold border-none"
                    >
                      Simulate Brand Approval & Release
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <div className="p-8 text-center text-slate-400">
              Select a contract to view details.
            </div>
          )}
        </Col>
      </Row>

      {/* Upload Deliverable Modal */}
      <Modal
        title={
          <span className="text-white font-bold text-lg">
            Submit Video Deliverable
          </span>
        }
        open={isUploadModalOpen}
        onCancel={() => setIsUploadModalOpen(false)}
        footer={null}
        destroyOnClose
        className="dark-modal"
      >
        <Form
          form={uploadForm}
          layout="vertical"
          onFinish={handleUploadDeliverable}
          className="mt-4 space-y-3"
        >
          <Form.Item
            name="previewUrl"
            label={<span className="text-slate-300">YouTube Unlisted Link or Drive URL</span>}
            rules={[{ required: true, message: 'Please enter preview link' }]}
            initialValue="https://youtube.com/watch?v=unlisted_preview_demo"
          >
            <Input
              placeholder="https://youtu.be/..."
              className="bg-slate-900 border-slate-700 text-white"
            />
          </Form.Item>

          <Form.Item
            name="talkingPointsNote"
            label={<span className="text-slate-300">Sponsor Timestamp & Notes</span>}
            initialValue="Sponsor segment starts at 02:18 and runs through 03:42. UTM tracking link confirmed in description."
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <Button onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-indigo-600 hover:bg-indigo-500 font-semibold"
            >
              Submit for Brand Review
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
