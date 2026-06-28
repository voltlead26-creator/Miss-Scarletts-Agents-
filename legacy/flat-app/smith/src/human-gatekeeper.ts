export class AgentSmithTelegramNotifier {
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN ?? "";
  private readonly targetChatId = process.env.TELEGRAM_CHAT_ID ?? "";

  public async sendProposalToOwner(plainEnglishSummary: string): Promise<boolean> {
    if (!this.botToken || !this.targetChatId) {
      return false;
    }

    const telegramApiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    const payload = {
      chat_id: this.targetChatId,
      text: plainEnglishSummary,
      parse_mode: "Markdown"
    };

    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return response.ok;
  }
}
